class Api::V1::PollsController < ApplicationController
  # acts_as_token_authentication_handler_for User, fallback: :none
  before_action :set_poll, only: %i[show update destroy]

  # GET /polls
  def index
    @polls = Poll.all

    render json: @polls, include: ['sections']
  end

  # GET /polls/1
  def show
    render json: @poll, include: ['sections']
  end

  # POST /polls
  def create
    @poll = Poll.new(poll_params)

    if @poll.save
      render json: @poll, status: :created, location: @poll
    else
      render json: @poll.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /polls/1
  def update
    if @poll.update(poll_params)
      render json: @poll
    else
      render json: @poll.errors, status: :unprocessable_entity
    end
  end

  # DELETE /polls/1
  def destroy
    @poll.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_poll
    @poll = Poll.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def poll_params
    params.fetch(:poll, {})
  end
end
