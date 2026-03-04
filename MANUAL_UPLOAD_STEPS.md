# 🚀 手动上传步骤（最简单）

由于GitHub CLI需要交互式登录，这里提供最简单的手动方法：

## 方法一：GitHub Desktop（最简单，推荐）

### 1. 下载并安装 GitHub Desktop
👉 https://desktop.github.com/

### 2. 打开 GitHub Desktop
- 使用GitHub账号登录

### 3. 添加本地仓库
- File → Add Local Repository
- 选择文件夹：`C:\Users\Lenovo\Downloads\worldmonitor-main`
- 点击 **Add Repository**

### 4. 发布到 GitHub
- 点击 **Publish repository** 按钮
- 仓库名称输入：`worldmonitor-enhanced`
- 描述：`Real-time global intelligence with AI trading and military tracking`
- 取消勾选 **Keep this code private**（设为公开）
- 点击 **Publish Repository**

✅ **完成！** 几秒钟后代码就会上传到 GitHub

---

## 方法二：GitHub 网站 + Git命令（也很简单）

### 第1步：在GitHub网站创建仓库

1. 访问：👉 **https://github.com/new**

2. 填写信息：
   - **Repository name**: `worldmonitor-enhanced`
   - **Description**: `Real-time global intelligence with Quant Trading AI, Military Tracking & Energy Intelligence`
   - 选择 **Public**（公开）
   - **不要勾选** "Add a README file" 等选项

3. 点击 **Create repository**

### 第2步：推送代码

创建完仓库后，GitHub会显示命令。或者直接在PowerShell运行：

```powershell
cd C:\Users\Lenovo\Downloads\worldmonitor-main

# 检查远程仓库
git remote -v

# 如果remote已存在，删除并重新添加
git remote remove origin
git remote add origin https://github.com/sjkncs/worldmonitor-enhanced.git

# 推送代码
git push -u origin main
```

### 第3步：输入认证信息

系统会要求输入：
- **Username**: `sjkncs`（你的GitHub用户名）
- **Password**: 这里需要输入 **Personal Access Token**（不是密码）

#### 如何获取 Personal Access Token：

1. 访问：👉 **https://github.com/settings/tokens**
2. 点击 **Generate new token** → **Generate new token (classic)**
3. 填写：
   - **Note**: `worldmonitor-upload`
   - **Expiration**: `90 days`（或更长）
   - **Scopes**: 勾选 ✅ **repo**（所有repo相关权限）
4. 点击 **Generate token**
5. **复制生成的token**（只显示一次！）

6. 回到PowerShell，在Password处粘贴这个token

✅ **完成！** 代码开始上传

---

## 方法三：使用 GitHub CLI（需要浏览器认证）

如果想继续使用CLI，请在PowerShell中：

```powershell
# 1. 先登录（会打开浏览器）
gh auth login

# 按照提示选择：
# - GitHub.com
# - HTTPS
# - Login with a web browser
# - 复制显示的代码
# - 在浏览器中粘贴并授权

# 2. 登录成功后创建仓库
gh repo create sjkncs/worldmonitor-enhanced --public --source=. --push
```

---

## 快速选择建议

| 方法 | 难度 | 推荐度 | 时间 |
|------|------|--------|------|
| **GitHub Desktop** | ⭐ 最简单 | ⭐⭐⭐⭐⭐ | 2分钟 |
| **网站+Git命令** | ⭐⭐ 简单 | ⭐⭐⭐⭐ | 3分钟 |
| **GitHub CLI** | ⭐⭐⭐ 中等 | ⭐⭐⭐ | 5分钟 |

---

## 验证上传成功

上传完成后，访问查看：
👉 **https://github.com/sjkncs/worldmonitor-enhanced**

应该能看到：
- ✅ README.md 显示完整
- ✅ 所有文件已上传
- ✅ docs/新功能说明/ 文件夹存在

---

## 需要帮助？

如果遇到问题，告诉我具体的错误信息，我会帮你解决！ 🤝

---

<p align="center">
  <strong>推荐使用 GitHub Desktop，最快最简单！</strong>
</p>
