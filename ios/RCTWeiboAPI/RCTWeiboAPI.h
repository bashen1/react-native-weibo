//
//  RCTWeiboAPI.h
//  RCTWeiboAPI
//
//  Created by LvBingru on 1/6/16.
//  Copyright © 2016 erica. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "WeiboSDK.h"

@interface RCTWeiboAPI : RCTEventEmitter<RCTBridgeModule>
+ (void)didReceiveWeiboRequest:(WBBaseRequest *_Nullable)request;
+ (void)didReceiveWeiboResponse:(WBBaseResponse *_Nullable)response;
@end
