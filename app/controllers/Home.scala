package controllers

import play.api.mvc._

object Home extends Controller {

  def aboutRed = Action {
    Ok(views.html.aboutRed("About RED - RED|N"))
  }

  def aboutN = Action {
    Ok(views.html.aboutN("About N interior - RED|N"))
  }

  def aboutContact = Action {
    Ok(views.html.aboutContact("About Contact - RED|N"))
  }

  def aboutWork = Action {
    Ok(views.html.aboutWork("About Work - RED|N"))
  }

  def aboutTeam = Action {
    Ok(views.html.aboutTeam("About Team - RED|N"))
  }

  def main = Action {
    Ok(views.html.aboutMain("About - RED|N"))
  }

}