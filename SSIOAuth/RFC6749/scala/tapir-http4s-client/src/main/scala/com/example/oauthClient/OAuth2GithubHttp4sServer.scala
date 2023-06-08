package com.examples.oauthClient

// OAuth2 client based on example from softwre mill tapir: https://github.com/softwaremill/tapir
// Example itself:  https://github.com/softwaremill/tapir/blob/master/examples/src/main/scala/sttp/tapir/examples/OAuth2GithubHttp4sServer.scala

import cats.effect._
import cats.syntax.all._
import io.circe._
import io.circe.generic.auto._
import org.http4s.HttpRoutes
import org.http4s.server.Router
import org.http4s.blaze.server.BlazeServerBuilder
import org.http4s.syntax.kleisli._
import pdi.jwt.*
import sttp.client3.{*,given}
import sttp.client3.circe.{*,given}
import sttp.client3.asynchttpclient.cats.AsyncHttpClientCatsBackend
import sttp.model.StatusCode
import sttp.model.headers._
import sttp.tapir.{given, *}
import sttp.tapir.generic.auto._
import sttp.tapir.json.circe._
import sttp.tapir.server.{_,given}
import sttp.tapir.server.http4s.Http4sServerInterpreter

import java.time.Instant
import scala.collection.immutable.ListMap
import scala.concurrent.ExecutionContext
import scala.util.control.NonFatal

import cps.*
import cps.monads.catsEffect.{*,given}

object OAuth2GithubHttp4sServer extends IOApp {

  implicit val ec: ExecutionContext = scala.concurrent.ExecutionContext.Implicits.global

  // github application details
  //val clientId = "<put your client id here>"
  //val clientSecret = "<put your client secret>"

  // algorithm used for jwt encoding and decoding
  //val jwtAlgo = JwtAlgorithm.HS256
  val jwtAlgo = JwtAlgorithm.RS512
  // val jwtKey = "my secret key"

  type Limit = Int
  type AuthToken = String

  case class AccessDetails(token: String)

 
  def authOAuth2(cfg: AppConfig, scopes: ListMap[String, String]) = auth.oauth2.authorizationCode(
                        Some(cfg.authorizationUrl), scopes, Some(cfg.accessTokenUrl))

  // endpoint declarations
  val login: PublicEndpoint[Unit, Unit, String, Any] =
    endpoint.get
      .in("login")
      .out(statusCode(StatusCode.PermanentRedirect))
      .out(header[String]("Location"))

  val loginZaka: PublicEndpoint[String, String, (CookieValueWithMeta, String), Any] =
    endpoint.get
      .in("login" / "oauth2" / "zaka")
      .in(query[String]("code"))
      .out(setCookie("ZakaAuth"))
      .out(statusCode(StatusCode.Found))
      .out(header[String]("Location"))
      .errorOut(stringBody)

      //.out(jsonBody[AccessDetails])
      // .errorOut(stringBody)

  def secretPlace1(cfg: AppConfig): Endpoint[String, Unit, String, String, Any] =
    endpoint.get
      .securityIn("secret-place1")
      .securityIn(authOAuth2(cfg,ListMap.empty))
      .out(stringBody)
      .errorOut(stringBody)

  def secretPlace2(cfg: AppConfig): Endpoint[String, Unit, String, String, Any] =
      endpoint.get
        .securityIn("secret-place2")
        .securityIn(authOAuth2(cfg,ListMap("a"->"read")))
        .out(stringBody)
        .errorOut(stringBody)

  // converting endpoints to routes

  def redirectUri(cfg: AppConfig): String =
    s"${cfg.baseUrl}/login/oauth2/zaka"

  // simply redirect to github auth service
  def loginRoute(cfg: AppConfig): HttpRoutes[IO] =
    Http4sServerInterpreter[IO]().toRoutes(login.serverLogic( _ => 
         IO(s"${cfg.authorizationUrl}?client_id=${cfg.clientId}&redirect_uri=${redirectUri(cfg)}&response_type=code".asRight[Unit])
    ))

  // after successful authorization oauth server redirects you here
  def loginFromOAuthRoute(cfg: AppConfig, backend: SttpBackend[IO, Any]): HttpRoutes[IO] =
    Http4sServerInterpreter[IO]().toRoutes(loginZaka.serverLogic(code =>
      basicRequest
        .response(asStringAlways)
        .post(uri"${cfg.accessTokenUrl}")
        .header("Content-type", "application/x-www-form-urlencoded; charset=UTF-8")
        .header("Accept", "application/json")
        .body(Map(
           "client_id" -> cfg.clientId,
           "client_secret" -> cfg.clientSecret,
           "code" -> code, 
           "grant_type" -> "authorization_code",
           "redirect_uri" -> redirectUri(cfg)
          ))
        .send(backend)
        .map(resp => {
          println(s"receive response from backend: $resp, url = ${cfg.accessTokenUrl}")
          // create jwt token, that client will use for authenticating to the app
          val now = Instant.now
          val expirationTime = now.plusSeconds(15 * 60)
          val jsBody = io.circe.parser.parse(resp.body).right.get  // assume we receive right json
          println(s"jsBody=$jsBody")
          val accessToken = jsBody.hcursor.downField("access_token").as[String].right.get
          /*
          val claim =
            JwtClaim(expiration = Some(expirationTime.getEpochSecond), 
                      issuedAt = Some(now.getEpochSecond), 
                      content = resp.body)
          */            
          //            
          //val token = JwtCirce.encode(claim, cfg.jwtKey, jwtAlgo)
          val cookieValue = CookieValueWithMeta(
            value = accessToken,
            expires = Some(expirationTime),
            maxAge = None,
            domain = None,
            path = Some("/"),
            secure = true,
            httpOnly = false,
            sameSite = Some(Cookie.SameSite.None),
            otherDirectives = Map.empty
          )
          println(s"token send:${accessToken}")
          Right((cookieValue, s"${cfg.baseUrl}/static/index.html" ))
        })
    ))


  // try to decode the provided jwt
  def authenticate(token: String, cfg: AppConfig): Either[String, String] = {
    JwtCirce
      .decodeAll(token, cfg.jwtPublicKey, Seq(jwtAlgo))
      .toEither
      .leftMap(err => "Invalid token: " + err)
      .map(decoded => decoded._2.content)
  }

  // get user details from decoded jwt
  def secretPlaceRoute1(cfg: AppConfig): HttpRoutes[IO] = Http4sServerInterpreter[IO]().toRoutes(
      secretPlace1(cfg)
        .serverSecurityLogic(token => IO(authenticate(token, cfg)))
        .serverLogic(authDetails => _ =>  IO(("Your details: " + authDetails).asRight[String] ))
  )
      

  def secretPlaceRoute2(cfg: AppConfig): HttpRoutes[IO] = Http4sServerInterpreter[IO]().toRoutes(
    secretPlace2(cfg)
      .serverSecurityLogic(token => IO(authenticate(token, cfg)))
      .serverLogic(authDetails => _ =>  IO(("Your details: " + authDetails).asRight[String] ))
  )
    

  def staticRoute(cfg: AppConfig): HttpRoutes[IO] = 
    Http4sServerInterpreter[IO]().toRoutes(resourcesGetServerEndpoint("static")(
       classOf[OAuth2GithubHttp4sServer.type].getClassLoader(),"static"))

  val httpClient = AsyncHttpClientCatsBackend.resource[IO]()

  override def run(args: List[String]): IO[ExitCode] = {

    val fname = if (args.length > 1) { args(1) } else "appConfig.json";
    val cfg = AppConfig.read(fname) 

    println(s"jwt:\n${cfg.jwtPublicKey}")

    // starting the server
    httpClient
      .use(backend =>
        BlazeServerBuilder[IO](ec)
          .bindHttp(8080, "localhost")
          .withHttpApp(
             Router("/" -> (
                secretPlaceRoute1(cfg) <+> loginRoute(cfg) <+> loginFromOAuthRoute(cfg,backend) <+> staticRoute(cfg)
             )).orNotFound)
          .resource
          .use{ _ =>
            async[IO] {
              println("Started server on: http://localhost:8080")
              println(s"External url to login should be ${cfg.baseUrl}/login")
              println(s"External url to secret-place:${cfg.baseUrl}/secret-place1")
              await(IO.never)
            }
          }
      )
      .as(ExitCode.Success)
  }
}
