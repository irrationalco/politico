class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :first_name, :last_name, 
             :superadmin, :supervisor, :manager, :capturist
end
