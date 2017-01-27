require "rails_helper"

RSpec.describe ProyectionDataController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/proyection_data").to route_to("proyection_data#index")
    end

    it "routes to #new" do
      expect(:get => "/proyection_data/new").to route_to("proyection_data#new")
    end

    it "routes to #show" do
      expect(:get => "/proyection_data/1").to route_to("proyection_data#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/proyection_data/1/edit").to route_to("proyection_data#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/proyection_data").to route_to("proyection_data#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/proyection_data/1").to route_to("proyection_data#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/proyection_data/1").to route_to("proyection_data#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/proyection_data/1").to route_to("proyection_data#destroy", :id => "1")
    end

  end
end
