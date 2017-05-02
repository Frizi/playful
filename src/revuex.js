// @flow

type ScopedGetterFn<S, O> = (state: S) => O

type ActionCtx<S> = {commit: Commit, dispatch: Dispatch, state: S}
type MutationCtx<S> = {state: S}

type ScopedActionFn<S, I, O> = (ctx: ActionCtx<S>, payload: I) => O
type ScopedMutationFn<S, I, O> = (state: S, payload: I) => O

type Getter<O> = () => O
type Action<I, O> = { _dispatch: (payload: I) => O }
type Mutation<I, O> = { _commit: (payload: I) => O }

type Dispatch = <I, O>(action: Action<I, O>, payload: I) => O
type Commit = <I, O>(mutation: Mutation<I, O>, payload: I) => O

type GetterCtor<S> = <O> (fn: ScopedGetterFn<S, O>) => Getter<O>
type ActionCtor<S> = <I, O>(fn: ScopedActionFn<S, I, O>) => Action<I, O>
type MutationCtor<S> = <I, O>(fn: ScopedMutationFn<S, I, O>) => Mutation<I, O>

export type Module<S> = {
  getter: GetterCtor<S>,
  action: ActionCtor<S>,
  mutation: MutationCtor<S>,
  dispatch: Dispatch
}

let _Vue = null

export function createModule<S>(initialState: S, modName: string) : Module<S> {
  if(_Vue == null) {
    throw new Error(`Revuex not initialized when creating module ${modName}.`)
  }

  const state : S = new _Vue({data: initialState}).$data

  const commit = <I, O>(mut: Mutation<I, O>, payload: I): O => mut._commit(payload)
  const dispatch = <I, O>(act: Action<I, O>, payload: I): O => act._dispatch(payload)

  const actionCtx: ActionCtx<S> = {state, commit, dispatch}

  const action: ActionCtor<S> =
    <I, O>(actionFn: ScopedActionFn<S, I, O>): Action<I, O> =>
        ({ _dispatch: (payload: I) : O => actionFn(actionCtx, payload) })

  const mutation: MutationCtor<S> =
    <I, O>(mutationFn: ScopedMutationFn<S, I, O>): Mutation<I, O> =>
        ({ _commit: (payload: I): O => mutationFn(state, payload) })

  const getter : GetterCtor<S> = (fn) => {
    if (_Vue == null) throw null
    const vm = new _Vue({
      computed: {
        output () {
          return fn(state)
        }
      }
    })
    const getFn = () => {
      return vm.output
    }

    getFn._revuexGetter = true
    return getFn
  }

  return { getter, action, mutation, dispatch }
}

const revuex = {
  beforeCreate () {
    const options = this.$options
    if (options.getters) {
      Object.keys(options.getters).forEach(name => {
        const getter = options.getters[name]
        if (!getter || !getter._revuexGetter) {
          throw new Error(`The getter '${name}' is not a valid getter.`)
        }
        Object.defineProperty(this, name, {
          get: getter
        })
      })
    }

    if (options.actions) {
      const methods = options.methods = options.methods || {}
      Object.keys(options.actions).forEach(name => {
        const action = options.actions[name]
        if (!action._dispatch) {
          throw new Error(`The action '${name}' is not a valid action.`)
        }
        methods[name] = action._dispatch
      })
    }
  }
}

export default (Vue: any) => {
    _Vue = Vue
    Vue.mixin(revuex)
}
