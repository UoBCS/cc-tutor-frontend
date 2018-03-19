import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

export default class Algorithms extends Component {
  render() {
    return (
      <div id='algorithms' className='ApiDocumentation_section'>
        <div className='ApiDocumentation_section_inner'>
          <Header as='h1'>Algorithms</Header>

          <p>
            This endpoint includes the algorithms used in CC Tutor (automata theory).
          </p>

          <pre>
            /algorithms
          </pre>

          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_get_verb'>GET</span> /regex2nfa/:regex</Header>

            <p>Transforms a regular expression to an equivalent non-deterministic finite automaton representation.</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Parameters</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  regex
                  <span className='ApiDocumentation_list_item_label_extra'>string, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The regex to build the non-deterministic finite automaton with.</p>
              </li>
            </ul>

            <Header as='h5' className='ApiDocumentation_list_title'>Result</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  breakpoints
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#breakpoints_object'>breakpoints</a></span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The breakpoint object for the algorithm.</p>
              </li>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  nfa
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#finite_automaton_object'>finite automaton</a></span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The finite automaton object.</p>
              </li>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  regex_tree
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#tree_object'>tree</a></span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The tree object representing .</p>
              </li>
            </ul>
          </section>


          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_post_verb'>POST</span> /nfa2dfa</Header>

            <p>Transforms a non-deterministic finite automaton to a deterministic one.</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Parameters</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  nfa
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#finite_automaton_object'>finite automaton</a>, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The non-deterministic finite automaton to convert.</p>
              </li>
            </ul>

            <Header as='h5' className='ApiDocumentation_list_title'>Result</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  breakpoints
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#breakpoints_object'>breakpoints</a></span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The breakpoint object for the algorithm.</p>
              </li>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  nfa
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#finite_automaton_object'>finite automaton</a></span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The deterministic finite automaton object.</p>
              </li>
            </ul>
          </section>


          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_post_verb'>POST</span> /minimize-dfa</Header>

            <p>Minimize a DFA.</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Parameters</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  dfa
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#finite_automaton_object'>finite automaton</a>, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The deterministic finite automaton to minimize.</p>
              </li>
            </ul>

            <Header as='h5' className='ApiDocumentation_list_title'>Result</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  breakpoints
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#breakpoints_object'>breakpoints</a></span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The breakpoint object for the algorithm.</p>
              </li>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  nfa
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#finite_automaton_object'>finite automaton</a></span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The deterministic finite automaton object.</p>
              </li>
            </ul>
          </section>


          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_post_verb'>POST</span> /dfa-operations/membership</Header>

            <p>Test if a word is accepted by the supplied DFA.</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Parameters</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  dfa
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#finite_automaton_object'>finite automaton</a>, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The deterministic finite automaton.</p>
              </li>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  word
                  <span className='ApiDocumentation_list_item_label_extra'>string, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The word to test.</p>
              </li>
            </ul>

            <Header as='h5' className='ApiDocumentation_list_title'>Result</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  breakpoints
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#breakpoints_object'>breakpoints</a></span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The breakpoint object for the algorithm.</p>
              </li>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  is_member
                  <span className='ApiDocumentation_list_item_label_extra'>boolean</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The test result.</p>
              </li>
            </ul>
          </section>


          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_post_verb'>POST</span> /cek-machine/next-step</Header>

            <p>Runs a single step for the supplied CEK machine.</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Parameters</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  cek_machine
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#cek_machine_object'>CEK machine</a>, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The CEK machine.</p>
              </li>
            </ul>

            <Header as='h5' className='ApiDocumentation_list_title'>Result</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  cek_machine
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#breakpoints_object'>CEK machine</a></span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The resulting state of the CEK machine.</p>
              </li>
            </ul>
          </section>


          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_post_verb'>POST</span> /cek-machine/run</Header>

            <p>Entire run of a CEK machine.</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Parameters</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  cek_machine
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#cek_machine_object'>CEK machine</a>, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The CEK machine.</p>
              </li>
            </ul>

            <Header as='h5' className='ApiDocumentation_list_title'>Result</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  breakpoints
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#breakpoints_object'>breakpoints</a></span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The breakpoints corresponding to the CEK machine run.</p>
              </li>
            </ul>
          </section>

        </div>
      </div>
    );
  }

}
