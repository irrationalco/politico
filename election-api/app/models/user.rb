class User < ApplicationRecord
  acts_as_token_authenticatable

  belongs_to :suborganization
  has_many   :voters

  # Predicates
  def is_superadmin?
    superadmin
  end

  def is_supervisor?
    supervisor    
  end
  
  def is_capturist?
    capturist
  end

  def is_manager?
    manager
  end

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  def self.find_by_token(token)
    User.where(authentication_token: token).take
  end
end
