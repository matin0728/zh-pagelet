describe('Class and instance registry', function(){
  beforeEach(function(){
    this.registry = ZH.core.Registry.getInstance()
  })

  describe('Short name map', function(){
    this.registry = ZH.core.Registry.setNameMap({longName: 'shortName'})

    it('Should return a shore name.', function(){
      expect(this.registry.shortName('longName')).to.be.equal('shortName')
    })

    it('Should return origin name if name not in map.', function(){
      expect(this.registry.shortName('not_exists_name')).to.be.equal('not_exists_name')
    })

  })

  describe('Constructor regist', function(){
    it('Should regitst and get constructor', function(){
      var myConstructor = function(){}

      var constructorTypeString = 'myConstructor'

      this.registry.registType(constructorTypeString, myConstructor)

      var constructor = this.registry.getConstructor(constructorTypeString)

      expect(constructor).to.be.equal(myConstructor)
    })


  })

  describe('Instance regist', function(){


    it('Should regist and get by Id', function(){
      var myInstance = {},
        myType = 'myType',
        myID = 'abcd'

      this.registry.registInstance(myType, myID, myInstance)
      var storedInstance = this.registry.getInstanceById(myType, myID)

      expect(myInstance).to.be.equal(storedInstance)
    })

    it('Should return instance by dom ID', function(){
      var myInstance = {},
          myType = 'myType',
          myID = 'abcd'

          this.registry.registInstance(myType, myID, myInstance)
    
      var storedInstance = this.registry.getInstanceByDomId(myType + '-' + myID)
      expect(myInstance).to.be.equal(storedInstance)
    })

  })

})















