resource "google_project" "redtn_discord_bots" {
  auto_create_network = true
  name                = var.project
  project_id          = var.project
}
