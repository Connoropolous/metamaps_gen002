FactoryGirl.define do
  factory :user do
    name { random_string(10) }
    email { random_string(10) + '@' + random_string(10) + '.com' }
    code { random_string(8) }
    joinedwithcode { code }
    password 'omgwtfbbq'

    # bypass validation of the joinedwithcode
    to_create { |instance| instance.save(validate: false) }
  end
end