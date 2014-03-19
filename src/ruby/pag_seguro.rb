require "active_support/all"

class PagSeguro
  API_EMAIL = "cadastros@grouplighthouse.com"
  API_TOKEN = "3316A859549C4EE9B4864D16B58193DE"

  def load(code)
    url = "https://ws.pagseguro.uol.com.br/v2/transactions/#{code}?email=#{API_EMAIL}&token=#{API_TOKEN}"
    response = Net::HTTP.get_response(URI.parse(url)).body
    Hash.from_xml(response).to_json
  end

end