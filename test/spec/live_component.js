var count = -1

ZH.ui.LiveComponent.prototype.getId = function() {
  count += 1
  return count
}


describe("live component", function(){
  beforeEach(function(){
    this.component  = new ZH.ui.LiveComponent()
    this.component.decorate(document.getElementById('sample'))
    console.log('Before every test.')
  })

  afterEach(function(){
    delete this.component
  })

  describe("#decorate", function(){
    it("Should marked as decorated.", function(){
      expect(this.component.getElement()).not.to.be.undefined
    })

    it('Should marked as in document', function(){
      expect(this.component.isInDocument()).to.be.true
    })

    it('Should can not be decorate again', function(){
      var c = this.component
      //Create a fn will throw an error.
      var fn = function(){
        c.decorate(document.getElementById('sample'))
      }
      expect(fn).to.throw(Error)
    })
  })

  describe('#options', function(){
    it('Should get right option value.', function(){
      var a = new ZH.ui.LiveComponent({}, {newOption: 'anyValue', maintainChildDomIndex: true})
      expect(a.options.maintainChildDomIndex).to.be.true
      expect(a.options.newOption).to.equal('anyValue')
    })

    it('Should do not add action listener on element by default.', function() {
      expect(this.component.options.addDefaultEventListener).to.be.false
    })
  })


  describe('#meta', function(){
    it('Should get meta from parent child chain.', function(){
      var a = new ZH.ui.LiveComponent({a:1})
      expect(a.meta.a).to.be.equal(1)

      var b = new ZH.ui.LiveComponent({b:2})
      b.addChild(a)
      var metaValue = a.getMeta('b')
      expect(metaValue).to.be.equal(2)
    })
  })


  describe('#child', function(){
    // Default not maintain child index.
    it('Should do not maintain child index by defaut.', function() {
      expect(this.component.options.maintainChildDomIndex).to.be.false
    })

    it('Should get child by name.', function() {
      var c1 = new ZH.ui.LiveComponent({name: "c1"})
          , c2 = new ZH.ui.LiveComponent({name: "c2"})
      c1.addChild(c2)
      var child = c1.findChildByName("c2")
      expect(child).to.be.equal(c2)

      var c3 = new ZH.ui.LiveComponent({name: "c3"})
      c2.addChild(c3)

      child = c1.findChildByName("c3", true)
      expect(child).to.be.equal(c3)
    })

    it('Should get childs by type', function() {
      var c1 = new ZH.ui.LiveComponent({name: "c1"})
          , c2 = new ZH.ui.LiveComponent({name: "c2"})
          , c3 = new ZH.ui.LiveComponent({name: "c3"})
          , c4 = new ZH.ui.LiveComponent({name: "c4"})
      c1.addChild(c2)
      c1.addChild(c3)
      c3.addChild(c4)

      //c1, c2, c3, c4 is the same type.
      var results = c1.findChildsByType(c1.getTypeString())
      expect(results.length).to.be.equal(2)

      //find deep.
      results = c1.findChildsByType(c1.getTypeString(), true)
      expect(results.length).to.be.equal(3)

    })

    it('Should get single child.', function(){
      var constructor = function() {
        this.getTypeString = function() {
          return 'test'
        }
      }

      goog.inherits(constructor, ZH.ui.LiveComponent)

      var c1 = new ZH.ui.LiveComponent({name: "c1"})
        , c2 = new ZH.ui.LiveComponent({name: "c2"})
        , c3 = new ZH.ui.LiveComponent({name: "c3"})
        , c4 = new constructor({name: "c4"})
      c1.addChild(c2)
      c1.addChild(c3)
      c3.addChild(c4)

      var result1 = c1.findChildByType(c1.getTypeString())
      expect(result1).to.be.not.null

      var result2 = c1.findChildByType(c4.getTypeString(), true)
      expect(result2).to.be.equal(c4)

    })

  })


})
