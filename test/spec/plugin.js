describe('Live component plugin interface.', function(){
  beforeEach(function(){
    this.plugin = new ZH.ui.LiveComponentPlugin()
  })

  describe('options', function(){
    it('Should has option set.', function(){
      this.plugin = new ZH.ui.LiveComponentPlugin({myOption: 1})
      expect(this.plugin.options.myOption).to.be.equal(1)

      this.plugin = new ZH.ui.LiveComponentPlugin({})
      //make sure don'effect prototype.
      expect(this.plugin.options.myOption).to.be.undefined

    })

  })

  describe('regist component', function(){
    it('should regist and unregist component.', function(){
      var component = {}
      this.plugin.registerComponentObject(component)
      var c = this.plugin.getComponent()
      expect(c).to.be.equal(component)

      this.plugin.unregisterComponentObject(component)
      var c1 = this.plugin.getComponent()
      expect(c1).to.be.null
    })
  })

  describe('Enable and disable.', function(){
      it('Should enable and disable component.', function(){
        var component = {}
        this.plugin.registerComponentObject(component)

        expect(this.plugin.isEnabled(component)).to.be.true

        this.plugin.disable(component)
        expect(this.plugin.isEnabled(component)).to.be.false
      })

  })




})