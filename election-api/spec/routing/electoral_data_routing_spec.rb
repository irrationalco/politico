require "rails_helper"

RSpec.describe ElectoralDataController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/electoral_data").to route_to("electoral_data#index")
    end

    it "routes to #new" do
      expect(:get => "/electoral_data/new").to route_to("electoral_data#new")
    end

    it "routes to #show" do
      expect(:get => "/electoral_data/1").to route_to("electoral_data#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/electoral_data/1/edit").to route_to("electoral_data#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/electoral_data").to route_to("electoral_data#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/electoral_data/1").to route_to("electoral_data#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/electoral_data/1").to route_to("electoral_data#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/electoral_data/1").to route_to("electoral_data#destroy", :id => "1")
    end

  end
end
