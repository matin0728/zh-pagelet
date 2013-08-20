
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
    it("should marked as decorated.", function(){
      expect(this.component.getElement()).not.to.be.undefined
    })

    it('should marked as in document', function(){
      expect(this.component.isInDocument()).to.be.true
    })

    it('should can not be decorate again', function(){
      var c = this.component
      //Create a fn will throw an error.
      var fn = function(){
        c.decorate(document.getElementById('sample'))
      }
      expect(fn).to.throw(Error)
    })
  })

  decorate('#options', function(){
    var a = new ZH.ui.LiveComponent({newOption: 'anyValue', maintainChildDomIndex: true})
    expect(a.options.maintainChildDomIndex).to.be.true
    expect(a.options.newOption).to.equal('anyValue')
  })

  describe('#child', function(){
    // Default not maintain child index.
    expect(this.component.options.maintainChildDomIndex).to.be.false
  })


})

// describe('Wombat', function() {
//     beforeEach(function() {
//         // this.wombat = new Wombat();

//       this.component  = new ZH.ui.LiveComponent()
//       this.component.decorate(document.getElementById('sample'))
//     });

//     afterEach(function() {
//         delete this.wombat;
//     });

//     describe('#eat', function() {
//         it('should throw if no food passed', function() {
//             expect(1).to.equal(2)
//         });

//     });

// });
