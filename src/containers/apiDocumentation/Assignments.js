import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

export default class Assignments extends Component {
  render() {
    return (
      <div id='assignments' className='ApiDocumentation_section'>
        <div className='ApiDocumentation_section_inner'>
          <Header as='h1'>Assignments</Header>

          <p>
            This endpoint includes the assignment segments available to both students and teachers.
          </p>

          <pre>
            /assignments
          </pre>

          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_get_verb'>GET</span> /</Header>

            <p>Get all assignments subscribed (student) to or created (teacher).</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Result</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  assignments
                  <span className='ApiDocumentation_list_item_label_extra'>array</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>An array of assignments.</p>
              </li>
            </ul>
          </section>


          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_post_verb'>POST</span> /</Header>

            <p>Create an assignment (only for teachers).</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Parameters</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  assignment
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#assignment_object'>assignment</a>, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The assignment to be created.</p>
              </li>
            </ul>
          </section>


          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_get_verb'>GET</span> /:id</Header>

            <p>Get the assignment with the contents (depending on the type).</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Parameters</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  assignment
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#assignment_object'>assignment</a></span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The assignment object with the contents.</p>
              </li>
            </ul>
          </section>


          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_post_verb'>POST</span> /</Header>

            <p>Create an assignment (only for teachers).</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Parameters</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  assignment
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#assignment_object'>assignment</a>, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The assignment to be created.</p>
              </li>
            </ul>
          </section>


          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_get_verb'>GET</span> /:id</Header>

            <p>Get the assignment with the contents (depending on the type).</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Parameters</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  id
                  <span className='ApiDocumentation_list_item_label_extra'>integer, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The ID of the assignment to retrieve.</p>
              </li>
            </ul>

            <Header as='h5' className='ApiDocumentation_list_title'>Result</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  assignment
                  <span className='ApiDocumentation_list_item_label_extra'><a href='#assignment_object'>assignment</a></span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The assignment object with the contents.</p>
              </li>
            </ul>
          </section>


          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_patch_verb'>PATCH</span> /:id</Header>

            <p>Update the assignment with new contents (depending on the type).</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Parameters</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  id
                  <span className='ApiDocumentation_list_item_label_extra'>integer, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The ID of the assignment to retrieve.</p>
              </li>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  assignment
                  <span className='ApiDocumentation_list_item_label_extra'>assignment, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The assignment extra contents.</p>
              </li>
            </ul>
          </section>


          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_delete_verb'>DELETE</span> /:id</Header>

            <p>Delete the assignment (only for teacher).</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Parameters</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  id
                  <span className='ApiDocumentation_list_item_label_extra'>integer, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The ID of the assignment to delete.</p>
              </li>
            </ul>
          </section>


          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_get_verb'>GET</span> /:id/submissions</Header>

            <p>Get the students submissions (only for teacher).</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Parameters</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  id
                  <span className='ApiDocumentation_list_item_label_extra'>integer, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The ID of the assignment.</p>
              </li>
            </ul>

            <Header as='h5' className='ApiDocumentation_list_title'>Result</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  submissions
                  <span className='ApiDocumentation_list_item_label_extra'>array</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>An array of assignment objects and their contents.</p>
              </li>
            </ul>
          </section>


          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_post_verb'>POST</span> /:id/submit</Header>

            <p>Submit an assignment you are subscribed to (only for students).</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Parameters</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  id
                  <span className='ApiDocumentation_list_item_label_extra'>integer, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The ID of the assignment.</p>
              </li>
            </ul>
          </section>


          <section className='ApiDocumentation_segment'>
            <Header as='h2' className='ApiDocumentation_segment_title'><span className='ApiDocumentation_post_verb'>POST</span> /:assignmentId/students/:studentId/run-tests</Header>

            <p>Run the student submission against your tests (only for teachers).</p>

            <Header as='h5' className='ApiDocumentation_list_title'>Parameters</Header>

            <ul className='ApiDocumentation_list_group'>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  assignmentId
                  <span className='ApiDocumentation_list_item_label_extra'>integer, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The ID of the assignment.</p>
              </li>
              <li className='ApiDocumentation_list_item'>
                <Header as='h3' className='ApiDocumentation_list_item_label'>
                  studentId
                  <span className='ApiDocumentation_list_item_label_extra'>integer, required</span>
                </Header>
                <p className='ApiDocumentation_list_item_description'>The ID of the student.</p>
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
