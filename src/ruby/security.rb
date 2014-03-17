helpers do
  def protected!
    return if authorized?
    headers["WWW-Authenticate"] = "Basic realm=\"Area Restrita\""
    halt 401, "Não Autorizado"
  end

  def authorized?
    @auth ||= Rack::Auth::Basic::Request.new(request.env)
    @auth.provided? and @auth.basic? and @auth.credentials and @auth.credentials == ["lighthouse", "0307lighthouse"]
  end
end