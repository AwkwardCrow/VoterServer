import {List, Map} from 'immutable';


export function setEntries(state, entries) {
  return state.set('entries', List(entries));
}

export function next(state) {
  const entries = state.get('entries').concat(getWinners(state.get('vote')));
  if (entries.size === 1) {
    return state.remove('vote')
                .remove('entries')
                .set('winner', entries.first());
  } else {
    return state.merge({
      vote: Map({ //add round element to the vote map, have the server generate/get it
        round: state.getIn(['vote', 'round'], 0) + 1, //get the 'round' IN the 'vote', default to 0 if null, and add 1
        pair: entries.take(2)}),
      entries: entries.skip(2),
    });
  }
}

export function vote(voteState, entry) {
  const [a,b] = voteState.get('pair');
  if(voteState.get('pair').includes(entry))
  {
    return voteState.updateIn(
      ['tally', entry],
      0,
      tally => tally + 1
    );
  }
  else
    return voteState;
}


export const INITIAL_STATE = Map();


function getWinners(vote) {
  if (!vote) return [];
  const [a, b] = vote.get('pair');
  const aVotes = vote.getIn(['tally', a], 0);
  const bVotes = vote.getIn(['tally', b], 0);
  if      (aVotes > bVotes)  return [a];
  else if (aVotes < bVotes)  return [b];
  else                       return [a, b];
}
