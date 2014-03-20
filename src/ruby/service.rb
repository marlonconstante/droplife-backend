require "sinatra"
require_relative "security"
require_relative "orchestrate"
require_relative "voucher"
require_relative "pag_seguro"

get "/experiencia/pesquisa" do
  protected!
  Orchestrate.new().search("Experiencia", "*")
end

post "/experiencia/salvar/*" do |key|
  protected!
  Orchestrate.new().save("Experiencia", key, request.body.read)
end

delete "/experiencia/remover/*" do |key|
  protected!
  Orchestrate.new().delete("Experiencia", key)
end

post "/voucher/generate" do
  protected!
  Voucher.new().generate(request.body.read);
end

get "/pagseguro/load/*" do |code|
  protected!
  PagSeguro.new().load(code);
end

get "/pagseguro/search" do
  protected!
  PagSeguro.new().search();
end

get "/cadastro/*/*" do |path, file|
  protected!
  send_file "src/#{path}/#{file}"
end