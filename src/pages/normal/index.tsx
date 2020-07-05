import Taro from '@tarojs/taro';
import { View, Input } from '@tarojs/components';
import {
  VirtualListDataManager,
  VirtualListItemData,
} from 'taro-list-data-manager';
import TaroList from 'taro-list';

import './index.less';

interface NormalListState {
  list: VirtualListItemData<number>[];
  scrollToIndex: number | undefined;
}

export default class List extends Taro.Component<any, NormalListState> {
  page = 1;
  state: NormalListState = {
    list: [],
    scrollToIndex: undefined,
  };

  dataManager = new VirtualListDataManager<number>(
    {
      itemSize: 50,
      estimatedSize: 50,
      overscan: 14 * 3,
      onChange: (data) => {
        this.setState({
          list: data,
        });
      },
    },
    Taro
  );

  add = (start = 0) => {
    const data = Array.from({ length: 2000 }, (_, i) => start + i);

    this.dataManager.push(...data);
  };

  handleInit = () => {
    for (let i = 0; i < 10; i++) {
      this.add(i * 200);
    }
  };

  handleBlur = (evt) => {
    const { value } = evt.detail;

    const index = parseInt(value);

    if (!isNaN(index)) {
      this.setState({
        scrollToIndex: index,
      });
    }
  };

  render() {
    const { list, scrollToIndex } = this.state;

    return (
      <View>
        <View className='action-area'>
          <Input
            className='input'
            onBlur={this.handleBlur}
            placeholder='输入 scrollToIndex'
            type='number'
          />
        </View>
        <TaroList
          onVirtualListInit={this.handleInit}
          scrollToIndex={scrollToIndex}
          virtual
          height={`calc(90vh - var(--padding-bottom) - var(--padding-top))`}
          dataManager={this.dataManager}
        >
          {list.map((item) => (
            <View style={item.style} key={item.item} className='item'>
              #{item.index}
            </View>
          ))}
        </TaroList>
      </View>
    );
  }
}
