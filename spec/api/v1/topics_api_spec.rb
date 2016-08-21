require 'rails_helper'

RSpec.describe 'topics API', type: :request do
  let(:user) { create(:user, admin: true) }
  let(:token) { create(:token, user: user).token }
  let(:topic) { create(:topic, user: user) }

  it 'GET /api/v1/topics' do
    create_list(:topic, 5)
    get '/api/v1/topics', params: { access_token: token }

    expect(response).to have_http_status(:success)
    expect(response).to match_json_schema(:topics)
  end

  it 'GET /api/v1/topics/:id' do
    get "/api/v1/topics/#{topic.id}"

    expect(response).to have_http_status(:success)
    expect(response).to match_json_schema(:topic)
  end

  it 'POST /api/v1/topics' do
    post '/api/v1/topics', params: { topic: topic.attributes, access_token: token }

    expect(response).to have_http_status(:success)
    expect(response).to match_json_schema(:topic)
  end

  it 'PATCH /api/v1/topics/:id' do
    patch "/api/v1/topics/#{topic.id}", params: { topic: topic.attributes, access_token: token }

    expect(response).to have_http_status(:success)
    expect(response).to match_json_schema(:topic)
  end

  it 'DELETE /api/v1/topics/:id' do
    delete "/api/v1/topics/#{topic.id}", params: { access_token: token }

    expect(response).to have_http_status(:no_content)
  end

  context 'RAML example' do
    let(:resource) { get_json_example(:topic) }
    let(:collection) { get_json_example(:topics) }

    it 'resource matches schema' do
      expect(resource).to match_json_schema(:_topic)
    end

    it 'collection matches schema' do
      expect(collection).to match_json_schema(:topics)
    end
  end
end
