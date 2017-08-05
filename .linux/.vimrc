set nocompatible
filetype off

" Setup Vundle
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()
Plugin 'gmarik/Vundle.vim'
" Plugins

Plugin 'scrooloose/nerdtree'
Plugin 'jistr/vim-nerdtree-tabs'

Plugin 'altercation/vim-colors-solarized'

"Python
Plugin 'vim-scripts/indentpython.vim'
" Bundle 'Valloric/YouCompleteMe'

call vundle#end()
filetype plugin indent on

"  Configure Tab

" Python
au BufNewFile,BufRead *.py
    \ set tabstop=4
    \ set softtabstop=4
    \ set shiftwidth=4
    \ set textwidth=79
    \ set expandtab
    \ set autoindent
    \ set fileformat=unix

" All Files
set tabstop=2
set softtabstop=2
set shiftwidth=2

" Remove white spaces
autocmd BufWritePre * %s/\s\+$//e

" Set encoding
set encoding=utf-8

" Set number
set nu

" Pretty code
let python_highlight_all=1
syntax on

" Move between splits
nnoremap <C-J> <C-W><C-J>
nnoremap <C-K> <C-W><C-K>
nnoremap <C-L> <C-W><C-L>
nnoremap <C-H> <C-W><C-H>

" Enable folding
set foldmethod=indent
set foldlevel=99
nnoremap <space> za

" Normal mode
inoremap jj <ESC>

" You complete me config
" let g:ycm_autoclose_preview_window_after_completion=1
" map <leader>g  :YcmCompleter GoToDefinitionElseDeclaration<CR>

" Color keybind
call togglebg#map("<F5>")


