data "google_client_config" "current" {}

provider "google" {
  project = var.project
  credentials = var.gcp-creds
}

terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
    }
  }
}
