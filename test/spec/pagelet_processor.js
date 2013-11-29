describe('Test for BasePalgeletProcessor.', function(){

  var c1 = function() {

  }

  c1.prototype.decorate = function(element) {
    element.setAttribute('decorated', 'decorated')
  }

  c1.prototype.setId = function() {}

  var c2 = function() {

  }

  c2.prototype.setId = function() {}

  c2.prototype.decorate = function(element) {
    element.setAttribute('decorated', 'decorated')
  }

  ZH.core.Registry.getInstance().registType('a', c1)
  ZH.core.Registry.getInstance().registType('b', c2)

  var testCreateProcessor = function(pageletConfig) {
    return new ZH.net.PageletProcessor(
      new ZH.net.AbstractDependencyLoader(), 
      new ZH.net.Pagelet(pageletConfig)
    )
  }

  var testPagelet1 = {
    'html': '<div id="a">a.content<div id="b">b.content</div></div>',
    'dependency_tree': [
      {'id': 'a', 'js': 'a', 'css': 'a.css'}, 
      {'id': 'b', 'js': 'b', 'css': 'b.css'}
    ],
    'infor_map': {'ROOT':'a', 'a':['b']},
    'refer_node': 'ref-node',
    'render_type': 'decoration',
    'render_position': 'after'
  }

  var D = goog.dom
  var G = D.getElement


  beforeEach(function(){
    this.processor = null
    G('sample').innerHTML = ''
  })

  describe('decoration', function(){
    it('Should render after ref node.', function(){
      var refNode = D.createDom('div', {'id': 'ref-node'})
      G('sample').appendChild(refNode)  

      this.processor = testCreateProcessor(testPagelet1)
      this.processor.process()
      expect(G('a').getAttribute('decorated')).to.equal('decorated')
    })

  })


})