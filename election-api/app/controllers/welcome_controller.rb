class WelcomeController < ApplicationController
  def index
    render json: {hello: "Hola mundo"}
  end
end
