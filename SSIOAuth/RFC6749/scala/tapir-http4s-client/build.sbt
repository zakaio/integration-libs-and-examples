

name := "http4s-oauth-example"
scalaVersion := "3.1.0"
libraryDependencies ++= Seq(
  "com.softwaremill.sttp.tapir" %% "tapir-core" % "0.19.0-M15",
  "com.softwaremill.sttp.tapir" %% "tapir-http4s-server" % "0.19.0-M15",
  "com.softwaremill.sttp.tapir" %% "tapir-sttp-client" % "0.19.0-M15",
  "com.softwaremill.sttp.tapir" %% "tapir-json-circe" % "0.19.0-M15",
  "org.typelevel" %% "cats-effect" % "3.2.9",
  "com.softwaremill.sttp.client3" %% "async-http-client-backend-fs2" % "3.3.16",
  "com.softwaremill.sttp.client3" %% "async-http-client-backend-cats" % "3.3.16",
  "com.softwaremill.sttp.client3" %% "circe" % "3.3.16",
  "com.github.jwt-scala" %% "jwt-core" % "9.0.2",
  "com.github.jwt-scala" %% "jwt-circe" % "9.0.2",
  "com.geirsson" %% "metaconfig-typesafe-config" % "0.9.15",
  "com.github.rssh" %% "dotty-cps-async" % "0.9.4",
  "com.github.rssh" %% "cps-async-connect-cats-effect" % "0.9.1",
  "org.scalameta" %% "munit" % "0.7.29" % Test,
)
