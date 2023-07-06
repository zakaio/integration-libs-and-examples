

name := "http4s-oauth-example"
scalaVersion := "3.2.2"
libraryDependencies ++= Seq(
  "com.softwaremill.sttp.tapir" %% "tapir-core" % "1.4.0",
  "com.softwaremill.sttp.tapir" %% "tapir-http4s-server" % "1.4.0",
  "com.softwaremill.sttp.tapir" %% "tapir-sttp-client" % "1.4.0",
  "com.softwaremill.sttp.tapir" %% "tapir-json-circe" % "1.4.0",
  "org.http4s" %% "http4s-blaze-server" % "0.23.15",
  "org.typelevel" %% "cats-effect" % "3.5.0",
  "com.softwaremill.sttp.client3" %% "async-http-client-backend-fs2" % "3.8.15",
  "com.softwaremill.sttp.client3" %% "async-http-client-backend-cats" % "3.8.15",
  "com.softwaremill.sttp.client3" %% "circe" % "3.8.15",
  "com.github.jwt-scala" %% "jwt-core" % "9.0.2",
  "com.github.jwt-scala" %% "jwt-circe" % "9.0.2",
  "com.geirsson" %% "metaconfig-typesafe-config" % "0.9.15",
  "com.github.rssh" %% "dotty-cps-async" % "0.9.16",
  "com.github.rssh" %% "cps-async-connect-cats-effect" % "0.9.16",
  "ch.qos.logback" % "logback-classic" % "1.4.7",
  "org.scalameta" %% "munit" % "0.7.29" % Test,
)
