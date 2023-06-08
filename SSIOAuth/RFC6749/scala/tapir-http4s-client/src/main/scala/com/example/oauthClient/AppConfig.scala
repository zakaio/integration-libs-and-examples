package com.examples.oauthClient


import metaconfig.{*,given}


case class AppConfig(
                      baseUrl: String = "https://test.proofspace.id/test-oauth-client/rfc6749",
                      authorizationUrl: String = "https://test.proofspace.id/oauth2/authorization", // "https://github.com/login/oauth/authorize")
                      accessTokenUrl: String =  "https://test.proofspace.id/oauth2/token", // Some("https://github.com/login/oauth/access_token")
                      clientId: String = "CN17WBEBRPRd5PmRyrVvFx", // rssh-cr-6-test
                      clientSecret: String = "AAADDDDKKK",
                      jwtPublicKey: String = "",
                      jwtPublicKeyFile: Option[String] = None,
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
        //  println(s"file $fname not exists, use defaut");
        default
      } else {
        val input = Input.File(file)
        val value = Hocon.fromInput(input).get.as[AppConfig].get
        value.jwtPublicKeyFile match
          case Some(fname) =>
            if (!value.jwtPublicKey.isEmpty) {
              println(s"warning:  both jwtKey and jwtKeyfname are not empty, using file")
            }
            val jwtKey = scala.io.Source.fromFile(fname).getLines.mkString("\n")
            value.copy(jwtPublicKey = jwtKey)
          case None =>
            value
      }


