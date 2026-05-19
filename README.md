# 模拟考试小程序

一款无需服务器的模拟考试小程序，支持单选题、多选题和判断题，答错自动记录错题本，方便针对性练习。

## ✨ 功能特性

- 📝 **多题型支持**：单选题、多选题、判断题
- 🎲 **随机抽题**：每次练习随机抽取题目
- ✅ **即时判断**：选择答案后即时反馈对错，显示正确答案
- 📚 **错题本**：答错自动记录，支持错题练习，答对自动移除
- 📊 **成绩统计**：练习结束后显示总题数、正确数、正确率
- ⏸️ **继续练习**：中途退出可继续未完成的练习，进度自动保存
- 📱 **手机支持**：单文件打包，手机通过任意方式传输文件即可直接打开
- 💾 **本地存储**：题库、错题、练习进度自动保存到浏览器

## 🚀 快速开始

### 方式一：直接使用（推荐）

项目根目录下的 `模拟考试.html` 是一个完全独立的单文件，无需任何服务器或网络，直接用浏览器打开即可使用！

**电脑端**：双击 `模拟考试.html` 或 `启动考试.bat`

**手机端**：将 `模拟考试.html` 文件通过微信/QQ/邮件/USB等方式传输到手机，然后用浏览器打开即可。

> 提示：手机浏览器打开后可选择「添加到主屏幕」，方便下次使用。

### 方式二：开发模式

如果你想修改代码或重新构建：

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建单文件 HTML
npm run build
```

## 📖 使用说明

### 开始练习
1. 点击「开始练习」按钮，系统会从题库中随机抽取100道题
2. 每道题选择答案后，点击「确认答案」查看对错
3. 可通过答题卡快速跳转到任意题目

### 继续练习
- 练习中途可以点击「返回首页」，进度会自动保存
- 返回首页后会显示「继续练习」按钮，点击可回到之前的进度继续答题
- 也可以点击「重新练习」放弃当前进度，重新随机抽题

### 错题练习
- 答错的题目会自动收录到错题本中
- 错题练习中答对会自动从错题本移除
- 支持单独删除错题或清空全部错题

## 📂 项目结构

```
模拟考试/
├── 模拟考试.html        # 已打包好的单文件（直接使用）
├── 启动考试.bat          # 快速启动脚本
├── src/
│   ├── pages/
│   │   ├── Home.tsx     # 首页（题库管理、开始/继续练习）
│   │   ├── Practice.tsx # 练习页面（答题、判断、答题卡）
│   │   └── WrongList.tsx # 错题本页面
│   ├── components/
│   │   ├── QuestionCard.tsx   # 题目卡片
│   │   ├── OptionButton.tsx   # 选项按钮
│   │   ├── AnswerSheet.tsx    # 答题卡
│   │   ├── ResultPanel.tsx    # 结果统计
│   │   └── Navbar.tsx         # 导航栏
│   ├── store/
│   │   ├── questionStore.ts   # 题库状态管理
│   │   ├── practiceStore.ts   # 练习状态管理（含进度持久化）
│   │   └── wrongStore.ts      # 错题集状态管理
│   ├── types/
│   │   └── index.ts           # TypeScript 类型定义
│   ├── data/
│   │   └── builtinQuestions.json # 内置题库数据
│   └── utils/
│       ├── storage.ts         # localStorage 工具
│       └── excelParser.ts      # Excel 解析工具
└── 新分人员考试题库 .xlsx      # 原始题库文件
```

## 📝 题库文件格式

你可以上传自己的题库 Excel 或 CSV 文件，格式要求如下：

| 题干 | 题型 | 选项A | 选项B | 选项C | 选项D | 答案 | 解析 |
|------|------|-------|-------|-------|-------|------|------|
| 2026年一通三防工作的核心主线是？ | 单选题 | 队伍建设 | 重大灾害超前有效治理 | 技术创新 | 考核奖惩 | B | ... |
| 钻孔施工过程中，出现哪些预兆需要立即停止钻进？ | 多选题 | 瓦斯异常 | 温度骤升 | 水流增大 | | AB | ... |
| 发现火灾隐患应立即处理。 | 判断题 | 对 | 错 | | | 对 | ... |

### 答案格式说明
- **单选题**：答案填写单个选项（A/B/C/D）
- **多选题**：答案填写多个选项（如 AB、ABC）
- **判断题**：只需要填写选项 A「对」和选项 B「错」，答案填写「对」或「错」或「A」「B」

## 🛠️ 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Zustand** - 状态管理（支持 localStorage 持久化）
- **Tailwind CSS** - 样式框架
- **Vite** - 构建工具
- **SheetJS** - Excel 解析
- **vite-plugin-singlefile** - 单文件打包

## 📦 构建单文件

项目已配置好单文件打包，运行：

```bash
npm run build
```

构建产物在 `dist/index.html`，已自动复制到项目根目录命名为 `模拟考试.html`。

## 📝 更新题库

### 方式一：重新生成内置题库
修改 Excel 文件后，在项目目录下执行：

```bash
node -e "const XLSX=require('./node_modules/xlsx');const fs=require('fs');const wb=XLSX.readFile('你的题库.xlsx');const ws=wb.Sheets[wb.SheetNames[0]];const json=XLSX.utils.sheet_to_json(ws,{defval:''});const questions=json.map((r,i)=>({id:'q'+(i+1).toString().padStart(4,'0'),content:(r['题干']||'').toString().trim(),options:{A:(r['选项A']||'').toString().trim(),B:(r['选项B']||'').toString().trim(),C:(r['选项C']||'').toString().trim(),D:(r['选项D']||'').toString().trim()},answer:(r['答案']||'').toString().trim().toUpperCase().charAt(0),type:'single',analysis:''})).filter(q=>q.content&&q.answer);fs.writeFileSync('src/data/builtinQuestions.json',JSON.stringify(questions));console.log('Exported',questions.length,'questions');"
```

### 方式二：上传自定义题库
在应用首页点击「上传其他题库文件」按钮，选择 Excel 或 CSV 文件即可。

## 📄 许可证

MIT
