import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

export default class CompilerConstructionAssistant extends Component {
  render() {
    return (
      <div id='compiler_construction_assistant' className='ApiDocumentation_section'>
        <div className='ApiDocumentation_section_inner'>
          <Header as='h1'>Compiler Construction Assistant</Header>

          <p>
            This endpoint includes the compiler construction assistant segments.
          </p>

          <pre>
            /cca
          </pre>

          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_get_verb'>GET</span> /courses</Header>

            <p>Get all courses and the courses the user has subscribed to.</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Result</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  courses
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#course_object'>course</a>[]</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>An array of all the available courses.</p>
              </li>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  user_courses
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#course_object'>course</a>[]</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>An array of the courses the current user has subscribed to.</p>
              </li>
            </ul>
          </section>


          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_get_verb'>GET</span> /courses</Header>

            <p>Get all courses and the courses the user has subscribed to.</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Result</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  courses
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#course_object'>course</a>[]</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>An array of all the available courses.</p>
              </li>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  user_courses
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#course_object'>course</a>[]</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>An array of the courses the current user has subscribed to.</p>
              </li>
            </ul>
          </section>


          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_post_verb'>POST</span> /courses/:cid/subscribe</Header>

            <p>Subscribe to a course.</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Parameters</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  cid
                  <span className='ApiDocumentation_list_item_label_extra'>integer, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The ID of the course.</p>
              </li>
            </ul>

            <Header as='h5' className='ApiDocumentation_list_title'>Result</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  lesson
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#lesson_object'>lesson</a></span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The lesson data.</p>
              </li>
            </ul>
          </section>


          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_post_verb'>POST</span> /courses/:cid/unsubscribe</Header>

            <p>Unsubscribe from a course.</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Parameters</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  cid
                  <span className='ApiDocumentation_list_item_label_extra'>integer, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The ID of the course.</p>
              </li>
            </ul>
          </section>


          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_get_verb'>GET</span> /courses/:cid/lessons</Header>

            <p>Get all lessons in a course.</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Parameters</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  cid
                  <span className='ApiDocumentation_list_item_label_extra'>integer, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The ID of the course.</p>
              </li>
            </ul>

            <Header as='h5' className='ApiDocumentation_list_title'>Result</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  lessons
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#lesson_object'>lesson</a>[]</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The lessons in the course.</p>
              </li>
            </ul>
          </section>


          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_get_verb'>GET</span> /courses/:cid/lessons/:lid</Header>

            <p>Get a specific lesson.</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Parameters</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  cid
                  <span className='ApiDocumentation_list_item_label_extra'>integer, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The ID of the course.</p>
              </li>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  lid
                  <span className='ApiDocumentation_list_item_label_extra'>integer, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The ID of the lesson.</p>
              </li>
            </ul>

            <Header as='h5' className='ApiDocumentation_list_title'>Result</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  lesson
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#lesson_object'>lesson</a></span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The lesson in the course.</p>
              </li>
            </ul>
          </section>


          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_get_verb'>GET</span> /courses/:cid/current-lesson</Header>

            <p>Get the current lesson.</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Parameters</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  cid
                  <span className='ApiDocumentation_list_item_label_extra'>integer, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The ID of the course.</p>
              </li>
            </ul>

            <Header as='h5' className='ApiDocumentation_list_title'>Result</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  lesson
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#lesson_object'>lesson</a></span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The current lesson in the course.</p>
              </li>
            </ul>
          </section>


          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_patch_verb'>PATCH</span> /courses/:cid/lessons/:lid</Header>

            <p>Save the lesson progress.</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Parameters</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  cid
                  <span className='ApiDocumentation_list_item_label_extra'>integer, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The ID of the course.</p>
              </li>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  lid
                  <span className='ApiDocumentation_list_item_label_extra'>integer, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The ID of the lesson.</p>
              </li>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  files
                  <span className='ApiDocumentation_list_item_label_extra'>array, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The files associated with the lesson.</p>
              </li>
            </ul>
          </section>


          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_post_verb'>POST</span> /courses/:cid/lessons/:lid/submit</Header>

            <p>Submit the lesson files for testing.</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Parameters</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  cid
                  <span className='ApiDocumentation_list_item_label_extra'>integer, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The ID of the course.</p>
              </li>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  lid
                  <span className='ApiDocumentation_list_item_label_extra'>integer, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The ID of the lesson.</p>
              </li>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  files
                  <span className='ApiDocumentation_list_item_label_extra'>array, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The files associated with the lesson.</p>
              </li>
            </ul>

            <Header as='h5' className='ApiDocumentation_list_title'>Result</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  output
                  <span className='ApiDocumentation_list_item_label_extra'>string[]</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The output lines from the tests.</p>
              </li>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  exit_code
                  <span className='ApiDocumentation_list_item_label_extra'>integer</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>0 if success and 1 if fail.</p>
              </li>
            </ul>
          </section>

        </div>
      </div>
    );
  }

}
