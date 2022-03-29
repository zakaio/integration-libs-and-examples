package com.examples.oauthClient


import metaconfig.{*,given}

// you should have config file with this structure
case class AppConfig(
  baseUrl: String = "https://test2.zaka.io/test-oauth-client",
  authorizationUrl: String = "https://test.zaka.io/oauth/authorization", // "https://github.com/login/oauth/authorize")
  accessTokenUrl: String =  "https://test.zaka.io/oauth/token",    // Some("https://github.com/login/oauth/access_token")
  clientId: String = "0000000000000000000000",  // should be public did of you service.
  clientSecret: String = "test-client-secret", // which you should confiure in dushboard.
  jwtKey: String = "",
  jwtKeyFile: Option[String] = None,
  scopes:List[String] = List.empty 
)

object AppConfig:
   lazy val default = AppConfig()
   implicit lazy val surface: generic.Surface[AppConfig] = generic.deriveSurface[AppConfig]
   implicit lazy val decoder: ConfDecoder[AppConfig] = generic.deriveDecoder[AppConfig](default)
   implicit lazy val encoder: ConfEncoder[AppConfig] = generic.deriveEncoder[AppConfig]

   def read(fname: String): AppConfig =
      val file = new java.io.File(fname)
      if (!file.exists()) {
        //  throw new RuntimeException(s"file ${fname}  is not exists")
        println(s"file $fname not exists, use defaut");
        default
      } else {
        val input = Input.File(file)
        val value = Hocon.fromInput(input).get.as[AppConfig].get
        value.jwtKeyFile match
          case Some(fname) =>
            if (!value.jwtKey.isEmpty) {
              println(s"warning:  both jwtKey  ad jwtKeyfname is empty, using file")
            }
            val jwtKey = scala.io.Source.fromFile(fname).getLines.mkString("\n")
            value.copy(jwtKey = jwtKey)
          case None =>
            value
      }


