class URIParams {
  constructor() {
    this.params={}
  }
  setParam({key,value}) {
    this.params[key]=value
  }
  toString() {
    let stringParams=""
    for (const [key,value] of Object.entries(this.params)) {
      stringParams += stringParams === "" ? "?" : "&"
      stringParams += `${key}=${value}`
    }
    return stringParams
  }
}

class URI {
  constructor({host,path}) {
    this.host=host
    this.path=path
    this.params= new URIParams()
  }

  setParam({key,value}) {
    this.params.setParam({key,value})
  }

  toString() {
    let urlString = `${this.host}${this.path}${this.params.toString()}`
    return urlString
  }
}

class SDK {
  constructor() {
    this.apiKey="623450daad4c72eec7e8311f0cb3f9d8"
    this.baseUrl="https://api.openweathermap.org"
  }

  async getRequest({url}) {
    url.setParam({key:"appid",value:this.apiKey})
    const response = await fetch(url.toString())
    if (response.status === 200) {
      return await response.json()
    } else {
      throw await response.json()
    }
  }

  async geo({q}) {
    const path = "/geo/1.0/direct"
    const url = new URI({
      host:this.baseUrl,
      path:path
    })
    url.setParam({key:"q",value:q})
    return await this.getRequest({url:url})
  }

  async weather({lon,lat}) {
    const path = "/data/2.5/weather"
    const url = new URI({
      host:this.baseUrl,
      path:path
    })
    url.setParam({key:"lon",value:lon})
    url.setParam({key:"lat",value:lat})
    url.setParam({key:"units",value:"metric"})
    return await this.getRequest({url:url})
  }

  async forecast({lon,lat}) {
    const path = "/data/2.5/forecast"
    const url = new URI({
      host:this.baseUrl,
      path:path
    })
    url.setParam({key:"lon",value:lon})
    url.setParam({key:"lat",value:lat})
    url.setParam({key:"units",value:"metric"})
    return await this.getRequest({url:url})
  }

  async onecall({lon,lat}) {
    const path = "/data/3.0/onecall"
    const url = new URI({
      host:this.baseUrl,
      path:path
    })
    url.setParam({key:"lon",value:lon})
    url.setParam({key:"lat",value:lat})
    url.setParam({key:"units",value:"metric"})
    return await this.getRequest({url:url})
  }
}

export default SDK