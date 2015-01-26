package controllers

import play.api.mvc._

object Home extends Controller {

  def aboutRed = Action {
    Ok(views.html.aboutRed("Your new application is ready."))
  }

  def aboutN = Action {
    Ok(views.html.aboutN("About N interior - RED|N"))
  }

}