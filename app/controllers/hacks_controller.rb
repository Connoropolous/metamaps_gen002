# bad code that should be checked over before entering one of the
# nice files from the right side of this repo
class HacksController < ApplicationController
  include ActionView::Helpers::TextHelper # string truncate method

  # rate limited by rack-attack - currently 5r/s
  # TODO: what else can we do to make get_with_redirects safer?
  def load_url_title
    authorize :Hack
    url = params[:url]
    response, url = get_with_redirects(url)
    title = get_encoded_title(response)
    render json: { success: true, title: title, url: url }
  rescue StandardError => e
    render json: { success: false }
  end

  private

  def get_with_redirects(url)
    uri = URI.parse(url)
    response = Net::HTTP.get_response(uri)
    while response.code == '301'
      uri = URI.parse(response['location'])
      response = Net::HTTP.get_response(uri)
    end
    [response, uri.to_s]
  end

  def get_encoded_title(http_response)
    title = http_response.body.sub(/.*<title>(.*)<\/title>.*/m, '\1')
    charset = http_response['content-type'].sub(/.*charset=(.*);?.*/, '\1')
    charset = nil if charset == 'text/html'
    title = title.force_encoding(charset) if charset
    truncate(title, length: 140)
  end
end