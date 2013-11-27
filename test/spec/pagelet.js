describe('Pagelet test', function(){
	beforeEach(function(){
    this.pagelet = new ZH.net.Pagelet({
    	'infor_map': {
    		'ROOT': ['a'],
    		'a': ['b', 'c', 'd'],
    		'b': ['e', 'f']
    	}
    })
  })

	describe('Caculate the node count.', function(){
		it('Should get the count.', function(){
			var count = this.pagelet.getTotalNodeCount()
			expect(count).to.equal(6)
		})
	})

})