data "google_client_config" "current" {}

provider "google" {
  project = var.project
}

terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
    }
  }
}
