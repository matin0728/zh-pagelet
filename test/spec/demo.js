

describe('Functional programing', function(){
	describe('push and pop', function(){
		it('Should push and pop items.', function(){
			var stack = stack_make_stack()
			stack = stack_push(stack, 1)
			stack = stack_push(stack, 2)
			stack = stack_push(stack, 3)
			expect(stack_top(stack)).to.be.equal(3)

			stack = stack_pop(stack)
			expect(stack_top(stack)).to.be.equal(2)

			stack = stack_push(stack, 4)
			expect(stack_top(stack)).to.be.equal(4)
		})

		it('Should pass', function(){
			var s = stack_make_stack()

			var s1 = stack_push(s, 1)
			var s2 = stack_push(s, 2)

			var r1 = stack_pop(s1)
			
			
			
		})

	})

})