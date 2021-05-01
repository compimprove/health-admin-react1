import React, { Component } from 'react';
import { UserContext } from '../context/UserContext';
import { Avatar, Button, Card, Col, Form, Input, Layout, List, Row, Space, Table, Tabs, Typography } from 'antd';
import MealProgram from './MealProgram';
import { Link } from 'react-router-dom';
import ExerciseCreator from './ExerciseCreator';
import Url from '../service/url';
import Utils from '../service/utils';
import Popup from '../component/Popup';
import { ExerciseType } from '../models/EnumDefine';
const { Title } = Typography;
const { TabPane } = Tabs;

const columns = [
  {
    title: 'Name',
    dataIndex: 'title',
    key: 'title',
    render: (value, record) => (
      <Link to={Utils.createUrlWithParams(ExerciseCreator.routeName, {
        id: record._id
      })}>{value}</Link>
    )
  },
  {
    title: 'Length',
    dataIndex: 'steps',
    key: 'steps',
    render: function (value, record, index) {
      return <div>{value.reduce((prev, current) => prev + current.length, 0)} phút</div>
    }
  }
];

class TrainingOverview extends Component {
  static routeName = "/training-overview";
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
      trainingPrograms: [],
      exercises: [],
    }
  }


  componentDidMount() {
    this.getTrainingProgramData();
    this.getExercisesData();
  }

  async getTrainingProgramData() {
    let response = await this.context.axios({
      method: 'get',
      url: Url.TrainerTraining
    })
    console.log("get training program:", response.data);
    this.setState({ trainingPrograms: response.data });
  }

  async getExercisesData() {
    let response = await this.context.axios({
      method: 'get',
      url: Url.TrainerExercise
    })
    console.log("get exercises data:", response.data);
    this.setState({ exercises: response.data });
  }


  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout className="site-layout">
          <Tabs defaultActiveKey="2" size="large" tabBarStyle={{ backgroundColor: "#00111e", color: "white", height: "65px" }}>
            <TabPane tab="Quản lý chương trình tập luyện" key="1">
              <Row gutter={[10, 10]} style={{ marginLeft: 10, marginRight: 10 }}>
                <Col span={4} offset={20}>
                  <Button type="primary"><Link to={MealProgram.routeName}>Tạo Chương trình</Link></Button>
                </Col>
                {this.state.trainingPrograms.map(program => (
                  <TrainingProgramComponent key={program._id} program={program} />
                ))}
              </Row>
            </TabPane>
            <TabPane tab="Quản lý các bài tập" key="2">
              <Row gutter={[24, 24]} style={{ marginLeft: 10, marginRight: 10 }}>
                <Col offset={21} span={3}>
                  <Button type="primary"><Link to={`${ExerciseCreator.routeName}`} >Tạo bài tập</Link></Button>
                </Col>
                <Col span={24} >
                  <Table
                    dataSource={this.state.exercises} columns={columns}
                    expandable={{
                      expandedRowRender:
                        record => (
                          <List
                            grid={{ gutter: [0, 20], column: 6 }}
                            dataSource={record.steps}
                            renderItem={step => (
                              <List.Item>
                                <Card
                                  title={ExerciseType.getString(step.exerciseType)}>
                                  {step.title} <strong> {step.length}</strong> phút
                                </Card>
                              </List.Item>
                            )}
                          />),
                      rowExpandable: record => record.name !== 'Not Expandable',

                    }}
                  />
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Layout>
      </Layout>);
  }
}


function TrainingProgramComponent({ program, deleteMealProgram }) {
  return (
    <Col span={12}>
      <Card
        size="default"
      >
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
          <Title level={5}>{program.title}</Title>
          <div>
            <Button style={{ marginRight: "10px" }} type="primary">
              <Link to={Utils.createUrlWithParams(MealProgram.routeName, {
                mealProgramId: program._id
              })} >Chỉnh sửa</Link>
            </Button>
            <Popup
              btnStyle={{ type: "primary", danger: true }}
              btnContent="Xóa"
              onOk={deleteMealProgram}
              title="Bạn thực sự muốn xóa"
            >
              <span>{program.title}</span>
            </Popup>
          </div>
        </div>
        <List
          itemLayout="horizontal"
          dataSource={program.exercises}
          pagination={{
            pageSize: 4,
          }}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                key={item._id}
                title={
                  <Link to={Utils.createUrlWithParams(ExerciseCreator.routeName, {
                    id: item._id
                  })}>{item.title}</Link>
                }
                description={`Week: ${item.week}, Day: ${item.day}`}
              />
            </List.Item>
          )}
        />
      </Card>
    </Col>
  );
}

export default TrainingOverview;