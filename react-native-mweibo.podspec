require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name          = package['name']
  s.version       = package['version']
  s.summary       = package['description']
  s.description   = package['description']
  s.homepage      = package['homepage']
  s.license       = package['license']
  s.author        = package['author']
  s.platform      = :ios, "9.0"
  s.source        = { :git => "https://github.com/bashen1/react-native-weibo.git", :tag => "master" }
  s.source_files  = "ios/RCTWeiboAPI/**/*.{h,m}", "ios/libWeiboSDK/**/*.{h,m}"
  s.resource      = "ios/libWeiboSDK/WeiboSDK.bundle"
  s.requires_arc  = true
  s.vendored_libraries = "ios/libWeiboSDK/libWeiboSDK.a"
  s.resource_bundles = {
    'libWeiboSDK' => ['ios/libWeiboSDK/PrivacyInfo.xcprivacy'],
  }
  s.dependency 'React-Core'

end

