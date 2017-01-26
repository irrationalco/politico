require "rails_helper"

RSpec.describe ProyectionsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/proyections").to route_to("proyections#index")
    end

    it "routes to #new" do
      expect(:get => "/proyections/new").to route_to("proyections#new")
    end

    it "routes to #show" do
      expect(:get => "/proyections/1").to route_to("proyections#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/proyections/1/edit").to route_to("proyections#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/proyections").to route_to("proyections#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/proyections/1").to route_to("proyections#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/proyections/1").to route_to("proyections#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/proyections/1").to route_to("proyections#destroy", :id => "1")
    end

  end
end
