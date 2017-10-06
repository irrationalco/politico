class DeleteCapturedByFromVoters < ActiveRecord::Migration[5.0]
  def change
    remove_column :voters, :captured_by
  end
end
