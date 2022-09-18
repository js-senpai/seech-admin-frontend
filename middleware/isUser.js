export default function({ store, redirect }) {
  if (['admin','moderator'].includes(store.state.auth.user.type)) {
    return redirect("/");
  }
}
