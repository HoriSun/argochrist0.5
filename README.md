argochrist0.5
=============

关于标记语言的更改

1.别名注册时，头像用/-ava(\d*)/判定，其中数字为对应表情数目，本来用来预加载的，但明显预加载无效，是个坑。其对应地址不完整,缺少/_(\d*).png/,由talk()根据解析说话人的结果动态添加。

2.名字图像注册时使用/-name/

3.对话的match修改，增加了/-(\d)/的匹配，用于标记表情，数字对应头像表情的顺序。（写文档时发现应该用。（写文档时发现应该用/-(\d*)/的 = =）

4.实现和其他角色对话时，切换到主角而头像仍为对方。使用/~/在名字前标记，当有此标记时保持头像不变。（事实上这样使script编辑工作量加大，如能将标记位置反过来，就能少很多~标记）

关于CSS

1.首页的按钮和菜单栏的按钮是写死的，意味着要在js里增加一个选项都要在css里为之添加规则。

2.刚开始时，为了IE能显示正确的位置，将动态的container定位改为静态写死。

