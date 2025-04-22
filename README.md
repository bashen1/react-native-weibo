# react-native-mweibo

[![npm version](https://badge.fury.io/js/react-native-mweibo.svg)](https://badge.fury.io/js/react-native-mweibo)

iOS version：3.4.0

Android version：4.4.3

## 如何安装

### 安装npm包

```bash
npm install react-native-mweibo --save
```

### 工程配置

#### ios配置

在`Info->URL Types` 中增加微博的scheme： `Identifier` 设置为`sina`, `URL Schemes` 设置为你注册的微博开发者账号中的APPID，需要加前缀`wb`，例如`wb1915346979`

在你工程的`AppDelegate.h`文件中添加如下代码：

```objective-c
#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>
#import "WeiboSDK.h"

@interface AppDelegate: RCTAppDelegate <WeiboSDKDelegate>

@end

```

在你工程的`AppDelegate.m`文件中添加如下代码：

```objective-c
#import <React/RCTLinkingManager.h>

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation{
  [WeiboSDK handleOpenURL:url delegate:self];
  return [RCTLinkingManager application:application openURL:url sourceApplication:sourceApplication annotation:annotation];
}
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options {
  [WeiboSDK handleOpenURL:url delegate:self];
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url {
  return [WeiboSDK handleOpenURL:url delegate:self];
}

- (BOOL)application:(UIApplication *)application
continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void(^)(NSArray<id<UIUserActivityRestoring>> * __nullable
                             restorableObjects))restorationHandler {
  // 触发回调方法
  [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
  return [WeiboSDK handleOpenUniversalLink:userActivity delegate: self];
}

#pragma mark 新浪微博
- (void)didReceiveWeiboRequest:(WBBaseRequest * _Nullable)request {
  [RCTWeiboAPI didReceiveWeiboRequest:request];
}

- (void)didReceiveWeiboResponse:(WBBaseResponse * _Nullable)response {
  [RCTWeiboAPI didReceiveWeiboResponse:response];
}

```

##### iOS9的适配问题

由于iOS9的发布影响了微博SDK与应用的集成方式，为了确保好的应用体验，我们需要采取如下措施：

##### a.对传输安全的支持

在iOS9系统中，默认需要为每次网络传输建立SSL。解决这个问题：

- 将NSAllowsArbitraryLoads属性设置为YES，并添加到你应用的plist中

```xml
<key>NSAppTransportSecurity</key>
<dict>
<key>NSAllowsArbitraryLoads</key>
</true>
</dict>
```

###### b.对应用跳转的支持

如果你需要用到微博的相关功能，如登陆，分享等。并且需要实现跳转到微博的功能，在iOS9系统中就需要在你的app的plist中添加下列键值对。否则在canOpenURL函数执行时，就会返回NO。了解详情请至[https://developer.apple.com/videos/wwdc/2015/?id=703](https://developer.apple.com/videos/wwdc/2015/?id=703)

```xml
<key>LSApplicationQueriesSchemes</key>
<array>
  <string>sinaweibohd</string>
  <string>sinaweibo</string>
  <string>weibosdk</string>
  <string>weibosdk2.5</string>
</array>
```

#### Android

在`android/app/build.gradle`里，defaultConfig栏目下添加如下代码：

```javascript
manifestPlaceholders = [
    WB_APPID: "WB微博的APPID" //在此修改微博APPID
]
```

## 如何使用

```javascript
import * as WeiboAPI from 'react-native-mweibo';

// 初始化微博SDK（仅iOS），需要在调用API方法前调用
WeiboAPI.initSDK({
  universalLink: '微博的Universal Link',
});

WeiboAPI.login({
  scope: '权限设置', // 默认 'all'
  redirectURI: '重定向地址', // 默认 'https://api.weibo.com/oauth2/default.html'(必须和sina微博开放平台中应用高级设置中的redirectURI设置的一致，不然会登录失败)
});

// 返回一个`Promise`对象。成功时的回调为一个类似这样的对象：
{
  "accessToken": "2.005e3HMBzh7eFCca6a3854060GQFJf",
  "userID": "1098604232",
  "expirationDate": "1452884401084.538",
  "refreshToken": "2.005e3HMBzh8eFC3db19a18bb00pvbp"
}

// 分享到微博（文本）
WeiboAPI.share({
  type: 'text',
  text: '文字内容',
});

// 分享到微博（图片）
WeiboAPI.share({
  type: 'image',
  text: '文字内容',
  imageUrl: '图片地址'
});
```
