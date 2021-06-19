import React, { Component } from 'react';
import { UserContext } from '../context/UserContext';
import Url from '../service/url';
import { Avatar, Button, Card, Col, Form, Input, Layout, List, Row, Space, Tabs, Typography } from 'antd';
import { Link } from 'react-router-dom';
import MealProgram from './MealProgram';
import MealCreator from './MealCreator';
import Utils from '../service/utils';
import Popup from '../component/Popup';
const { Header } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

const cellHeight = 250;

class MealOverview extends Component {
  static routeName = "/meal-overview";
  static contextType = UserContext;
  state = {
    meals: [],
    mealPrograms: [],
  }

  async componentDidMount() {
    await this.getMealsData();
    await this.getMealProgramData();
  }


  async getMealsData() {
    let response = await this.context.axios({
      method: 'get',
      url: Url.TrainerMeal
    })
    console.log("get meals:", response.data);
    this.setState({ meals: response.data });
  }

  async getMealProgramData() {
    let response = await this.context.axios({
      method: 'get',
      url: Url.TrainerMealProgram
    })
    console.log("get meal program:", response.data);
    this.setState({ mealPrograms: response.data });
  }

  async deleteMeal(mealId) {
    let response = await this.context.axios({
      method: 'delete',
      url: Url.TrainerMeal + "/" + mealId
    });
    await this.getMealsData();
  }

  async deleteMealProgram(progamId) {
    let response = await this.context.axios({
      method: 'delete',
      url: Url.TrainerMealProgram + "/" + progamId
    });
    await this.getMealProgramData();
  }

  onChangeTab = (key) => {
    const url = new URL(window.location);
    url.searchParams.set('key', key);
    window.history.pushState({}, '', url);
  }

  render() {
    const url = new URL(window.location);
    const activeKey = url.searchParams.get('key') || 1;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout className="site-layout">
          <Tabs
            defaultActiveKey={activeKey}
            onChange={this.onChangeTab}
            size="large"
            tabBarStyle={{ backgroundColor: "#00111e", color: "white", height: "65px" }}>
            <TabPane tab="Quản lý chương trình dinh dưỡng" key="1">
              <Row gutter={[10, 10]} style={{ marginLeft: 10, marginRight: 10 }}>
                <Col span={4} offset={20}>
                  <Button type="primary"  ><Link to={MealProgram.routeName}>Tạo Chương trình</Link></Button>
                </Col>
                {this.state.mealPrograms.map(program => (
                  <MealProgramComponent
                    program={program}
                    deleteMealProgram={this.deleteMealProgram.bind(this, program._id)}
                  />
                ))}
              </Row>
            </TabPane>
            <TabPane tab="Quản lý các bữa ăn" key="2">
              <Row gutter={[24, 24]} style={{ marginLeft: 10, marginRight: 10 }}>
                <Col offset={21} span={3}>
                  <Button type="primary"><Link to={`${MealCreator.routeName}`} >Tạo bữa ăn</Link></Button>
                </Col>
                {this.state.meals.map(meal => (
                  <Col key={meal._id} span={6}>
                    <Card
                      size="default"
                      cover={<img alt="example" style={{ height: cellHeight }} src={meal.imageUrl} />}
                    >
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
                        <Title level={5}>{meal.title}</Title>
                      </div>
                      <Button style={{ marginRight: "10px" }} type="primary"><Link to={`${MealCreator.routeName}?mealId=${meal._id}`} >Chỉnh sửa</Link></Button>
                      <Popup
                        btnStyle={{ type: "primary", danger: true }}
                        btnContent="Xóa"
                        onOk={this.deleteMeal.bind(this, meal._id)}
                        title="Bạn thực sự muốn xóa"
                      >
                        <span>{meal.title}</span>
                      </Popup>
                    </Card>
                  </Col>
                ))}
              </Row>
            </TabPane>
          </Tabs>
        </Layout>
      </Layout>);
  }
}

function MealProgramComponent({ program, deleteMealProgram }) {
  return (
    <Col key={program._id} span={12}>
      <Card
        size="default"
      >
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
          <Title level={5}>{program.title}</Title>
          <div>
            <Button style={{ marginRight: "10px" }} type="primary"><Link to={Utils.createUrlWithParams(MealProgram.routeName, { mealProgramId: program._id })} >Chỉnh sửa</Link></Button>
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
          dataSource={program.meals}
          pagination={{
            pageSize: 4,
          }}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.imageUrl} />}
                title={<Link to={`${MealCreator.routeName}?mealId=${item.id}`}>{item.title}</Link>}
                description={`Tuần: ${item.week}, Ngày: ${item.day}`}
              />
            </List.Item>
          )}
        />
      </Card>
    </Col>
  );
}



export default MealOverview;