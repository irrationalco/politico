require 'rails_helper'

RSpec.describe "Projections", type: :request do
  describe "GET /projections" do
    it "works! (now write some real specs)" do
      get projections_path
      expect(response).to have_http_status(200)
    end
  end
end
