export const  state = () =>({
  basket: [],
  basketTotal: 0
})

export const mutations = {
  addToCart(state,ticket){
    const findDuplicates = state.basket.findIndex(({_id}) => _id === ticket._id);
    if(findDuplicates === -1){
      state.basket.push(ticket);
    }
  },
  removeFromCart(state,{_id}){
    state.basket = state.basket.filter((item) => item._id === _id)
  },
  setTotal(state,total){
    if(!Number.isNaN(total)){
      state.basketTotal = total;
    }
  }
}

export const actions = {
  async addToCart({commit},ticket){
    await this.$axios.post(`${this.$config.backendUrl}/basket`,{
      ticketId: ticket._id
    });
    commit('addToCart',ticket);
  },
  async removeFromCart({commit},{_id}){
    await this.$axios.delete(`${this.$config.backendUrl}/basket/${_id}`);
    commit('removeFromCart', {_id});
  },
  async getTotalBasket({commit}){
    const { data: { total = 0 } }  = await this.$axios.get(`${this.$config.backendUrl}/basket/total`);
    commit('setTotal',total);
  },
  async completeTicket({commit},{_id}){
    await this.$axios.put(`${this.$config.backendUrl}/basket/complete/${_id}`);
    commit('removeFromCart', {_id});
  }
}

export const getters = {
  getBasket: state => state.basket,
  getTotalBasket: state => state.basketTotal
}

