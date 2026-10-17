Pod::Spec.new do |s|
  s.name                        = "WBPLoginSDK"

  s.authors                     = "Weibo"
  s.homepage                    = "http://home.client.weibo.cn"
  s.license                     = 'Private'
  s.summary                     = s.name
  s.source                      = {:path => '.'}

s.pod_target_xcconfig = { 'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'arm64' }
s.user_target_xcconfig = { 'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'arm64' }




  s.public_header_files         = 'Public/*.h'
  s.source_files                = ["WBPLoginSDK/**/*.{h,m,c,s,S}","Public/*.{h,m}"]
  s.resources                   = ["Resources/*.{png,bundle}"]
  s.requires_arc                = true
  s.ios.deployment_target       = $WB_DEPLOYMENT_TARGET
  s.version                     = "1.0"
  s.libraries                   = 'z'
  s.static_framework            = true
  
  s.dependency 'WBPSDKCore'
  
#  s.wbp_vendored_frameworks('WBPLoginSDK.framework')
  
  s.subspec "non-ARC" do |ss|
      ss.source_files           = ["non-arc/**/*.{h,m,mm,c,s,S}"]
      s.public_header_files     = 'Public/*.h'
      ss.requires_arc           = false
  end
  
  s.xcconfig = {
                "GCC_PREPROCESSOR_DEFINITIONS" => 'COMPANY_INTERNAL=1 WeiboSDKDebug=1',
                'SUPPORTS_MACCATALYST' => 'NO'
  }
end

