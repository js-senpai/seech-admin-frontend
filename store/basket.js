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
  async getTotalBasket({commit}){
    const { data: { total = 0 } }  = await this.$axios.get(`${this.$config.backendUrl}/basket/total`);
    commit('setTotal',total);
  }
}

export const getters = {
  getBasket: state => state.basket,
  getTotalBasket: state => state.basketTotal
}

