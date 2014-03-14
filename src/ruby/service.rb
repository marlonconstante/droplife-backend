require "sinatra"
require "pdfkit"
require "launchy"
require "./src/ruby/orchestrate"

get "/experiencia/pesquisa" do
  protected!
  Orchestrate.new().search("Experiencia", nil)
end

post "/experiencia/salvar/*" do |key|
  protected!
  Orchestrate.new().save("Experiencia", key, request.body.read)
end

delete "/experiencia/remover/*" do |key|
  protected!
  Orchestrate.new().delete("Experiencia", key)
end

get "/voucher" do
  protected!

  kit = PDFKit.new(File.new("src/views/templates/voucher.html"))
  kit.to_file("files/voucher.pdf")
  Launchy::Browser.run("files/voucher.pdf")
end

get "/cadastro/*/*" do |path, file|
  protected!
  send_file "src/#{path}/#{file}"
end

helpers do
  def protected!
    return if authorized?
    headers["WWW-Authenticate"] = "Basic realm=\"Area Restrita\""
    halt 401, "Não Autorizado"
  end

  def authorized?
    @auth ||=  Rack::Auth::Basic::Request.new(request.env)
    @auth.provided? and @auth.basic? and @auth.credentials and @auth.credentials == ["lighthouse", "0307lighthouse"]
  end
end