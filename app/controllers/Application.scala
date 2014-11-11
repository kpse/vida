package controllers

import play.api.mvc._

object Application extends Controller {

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

  def cafe = Action {
    Ok(views.html.cafe(""))
  }

  def changanye() = Action {
    Ok(views.html.changanye("陕派摇滚&长安夜"))
  }
}