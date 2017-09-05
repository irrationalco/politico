require 'rails_helper'

RSpec.describe "ElectoralData", type: :request do
  describe "GET /electoral_data" do
    it "works! (now write some real specs)" do
      get electoral_data_path
      expect(response).to have_http_status(200)
    end
  end
end
